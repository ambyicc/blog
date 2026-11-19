---
title: 用 Pytest 组织接口测试
description: 从目录结构、fixture 到参数化，整理一套可复用的接口测试骨架。
pubDate: 2026-11-19
tags: ["测试", "Pytest"]
---

接口测试写到几十个用例之后，真正麻烦的往往不是断言本身，而是目录、登录态和测试数据的复用。这篇文章整理一套可以直接套用的 Pytest 结构。

## 按功能拆目录

不要把所有用例塞进一个 `test_api.py`。按业务模块拆目录，公共能力放到 `conftest.py`：

```text
tests/
├── conftest.py
├── api/
│   ├── conftest.py
│   ├── test_login.py
│   └── test_orders.py
└── data/
    └── orders.json
```

Pytest 会沿着目录向上收集 `conftest.py`，所以根目录放全局配置，子目录放模块级 fixture，互不干扰。

## conftest.py 里放什么

根级 `conftest.py` 通常只做三件事：读取环境配置、创建 HTTP 会话、准备测试数据。

```python
import os
import pytest
import requests


@pytest.fixture(scope="session")
def base_url():
    return os.getenv("API_BASE_URL", "https://httpbin.org")


@pytest.fixture(scope="session")
def session(base_url):
    with requests.Session() as client:
        client.headers.update({"Accept": "application/json"})
        yield client
```

`scope="session"` 表示整个测试会话只创建一次，避免每个用例都重新建连接。

## 用 fixture 管理登录态

登录接口通常只需要调用一次，把 token 缓存在 session 级 fixture 里：

```python
@pytest.fixture(scope="session")
def auth_headers(session, base_url):
    response = session.post(
        f"{base_url}/post",
        json={"username": "demo", "password": "secret"},
        timeout=10,
    )
    response.raise_for_status()
    token = response.json()["json"]
    return {"Authorization": f"Bearer {token}"}
```

需要登录的用例直接声明 `auth_headers` 即可，不需要在每个测试函数里重复登录。

## 参数化覆盖边界

同一套断言跑多组输入，用 `parametrize` 比复制粘贴更清晰：

```python
import pytest


@pytest.mark.parametrize(
    ("payload", "expected"),
    [
        ({"page": 1, "size": 10}, 200),
        ({"page": 0, "size": 10}, 400),
        ({"page": 1, "size": 0}, 400),
        ({"page": 1, "size": 101}, 400),
    ],
)
def test_order_list_pagination(session, base_url, auth_headers, payload, expected):
    response = session.get(
        f"{base_url}/get",
        params=payload,
        headers=auth_headers,
        timeout=10,
    )
    assert response.status_code == expected
```

参数名用元组写法，失败时 Pytest 的用例 ID 会直接带上输入值，定位很快。

## 断言要具体

只断言状态码 200 很容易漏掉业务错误。至少再检查一层响应结构：

```python
def test_order_detail(session, base_url, auth_headers):
    response = session.get(
        f"{base_url}/get",
        params={"order_id": "A1001"},
        headers=auth_headers,
        timeout=10,
    )

    assert response.status_code == 200
    body = response.json()
    assert body["args"]["order_id"] == "A1001"
    assert "headers" in body
```

如果接口有统一的错误码，建议封装一个 `assert_success(response)`，避免每个用例重复写。

## 运行与报告

本地按模块跑：

```bash
pytest tests/api -q
```

只看失败并生成 HTML 报告：

```bash
pytest tests/api --maxfail=1 --html=report.html --self-contained-html
```

CI 里再配合 `-n auto` 并行（需要 `pytest-xdist`），能明显缩短回归时间。

## 小结

- 目录按业务拆，`conftest.py` 按层级放 fixture。
- 登录态、HTTP 会话这类昂贵资源用 `session` scope。
- 边界输入用 `parametrize`，不要复制用例。
- 断言至少覆盖状态码和一层业务字段。

这套结构不依赖具体框架，换成公司的内部 HTTP 客户端也能直接迁移。
