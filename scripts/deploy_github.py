import os
import sys
import json
import base64
import urllib.request
import urllib.error

REPO_OWNER = "DimEk74"
REPO_NAME = "buhgalt2"
BRANCH = "main"

# Исключаемые папки и файлы
EXCLUDE_DIRS = {".git", ".gemini", "__pycache__", "node_modules", ".agents"}
EXCLUDE_FILES = {".DS_Store"}

def get_token():
    if len(sys.argv) > 1:
        return sys.argv[1].strip()
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        return token.strip()
    print("ОШИБКА: Токен не передан.")
    print("Использование: python scripts/deploy_github.py <YOUR_GITHUB_PAT_TOKEN>")
    sys.exit(1)

def github_request(url, method="GET", headers=None, body=None):
    if headers is None:
        headers = {}
    
    req = urllib.request.Request(url, headers=headers, method=method)
    if body:
        if isinstance(body, dict):
            req.data = json.dumps(body).encode("utf-8")
            req.add_header("Content-Type", "application/json")
        elif isinstance(body, bytes):
            req.data = body

    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            if data:
                return json.loads(data.decode("utf-8"))
            return {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        return {"error": e.code, "message": err_body}
    except Exception as e:
        return {"error": 500, "message": str(e)}

def upload_file(token, file_path, rel_path):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{rel_path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Antigravity-Deployer"
    }

    # Проверяем, существует ли уже этот файл на GitHub (чтобы передать sha для обновления)
    get_res = github_request(url, method="GET", headers=headers)
    sha = None
    if isinstance(get_res, dict) and "sha" in get_res:
        sha = get_res["sha"]

    with open(file_path, "rb") as f:
        content_bytes = f.read()

    b64_content = base64.b64encode(content_bytes).decode("utf-8")

    payload = {
        "message": f"Deploy {rel_path}",
        "content": b64_content,
        "branch": BRANCH
    }
    if sha:
        payload["sha"] = sha

    put_res = github_request(url, method="PUT", headers=headers, body=payload)
    if "error" in put_res:
        print(f"❌ Ошибка при загрузке {rel_path}: {put_res.get('message')}")
        return False
    else:
        print(f"✅ Успешно загружен: {rel_path}")
        return True

def enable_pages(token):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/pages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Antigravity-Deployer"
    }
    payload = {
        "source": {
            "branch": BRANCH,
            "path": "/"
        }
    }
    res = github_request(url, method="POST", headers=headers, body=payload)
    if "error" in res:
        print(f"ℹ️ Статус GitHub Pages: {res.get('message')}")
    else:
        print(f"🚀 GitHub Pages успешно включен! URL: https://{REPO_OWNER.lower()}.github.io/{REPO_NAME}/")

def main():
    token = get_token()
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    print(f"📦 Публикация файлов из {project_root} в {REPO_OWNER}/{REPO_NAME}...")

    success_count = 0
    fail_count = 0

    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file in files:
            if file in EXCLUDE_FILES or file.endswith(".pyc"):
                continue

            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, project_root).replace("\\", "/")

            print(f"Загрузка: {rel_path}...")
            if upload_file(token, full_path, rel_path):
                success_count += 1
            else:
                fail_count += 1

    print(f"\n📊 Итог публикации: Успешно: {success_count}, Ошибок: {fail_count}")

    if success_count > 0:
        print("\n⚙️ Включение GitHub Pages...")
        enable_pages(token)

if __name__ == "__main__":
    main()
