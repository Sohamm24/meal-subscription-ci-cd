import os
import shutil
import logging
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from pages.login_page import LoginPage
from pages.navbar import Navbar

logger = logging.getLogger("selenium_test_suite")


@pytest.fixture(scope="session")
def base_url() -> str:
    if "BASE_URL" in os.environ:
        return os.environ["BASE_URL"]
    if os.path.exists("/.dockerenv") or os.path.exists("/app"):
        return "http://host.docker.internal:5173"
    return "http://localhost:5173"


@pytest.fixture(scope="function")
def driver(base_url: str, request):
    test_name = request.node.name
    logger.info(f"--- [START DRIVER] for test: {test_name} ---")
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--remote-allow-origins=*")

    chrome_bin = os.environ.get("CHROME_BIN")
    if not chrome_bin:
        for possible in [
            "/usr/bin/chromium",
            "/usr/bin/google-chrome",
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        ]:
            if os.path.isfile(possible):
                chrome_bin = possible
                break

    if chrome_bin:
        options.binary_location = chrome_bin

    driver_path = os.environ.get("CHROMEDRIVER_PATH") or shutil.which("chromedriver") or shutil.which("chromium-driver")
    service = Service(executable_path=driver_path) if driver_path else None

    if service:
        driver = webdriver.Chrome(service=service, options=options)
    else:
        driver = webdriver.Chrome(options=options)

    driver.implicitly_wait(5)

    yield driver

    try:
        driver.execute_script("window.localStorage.clear();")
    except Exception:
        pass
    driver.quit()
    logger.info(f"--- [CLOSED DRIVER] for test: {test_name} ---")


@pytest.fixture(scope="function")
def customer_logged_in(driver, base_url):
    logger.info("Setting up logged-in customer session...")
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("customer@gmail.com", "customer123")
    # Wait until redirect away from /login happens
    WebDriverWait(driver, 10).until(lambda d: "/login" not in d.current_url)
    navbar = Navbar(driver, base_url)
    navbar.wait_for_visible(*Navbar.PROFILE_TOGGLE_BTN, timeout=10)
    logger.info(f"Customer successfully authenticated. Current URL: {driver.current_url}")
    return driver


@pytest.fixture(scope="function")
def admin_logged_in(driver, base_url):
    logger.info("Setting up logged-in admin session...")
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("admin@gmail.com", "admin123")
    WebDriverWait(driver, 10).until(lambda d: "/login" not in d.current_url)
    navbar = Navbar(driver, base_url)
    navbar.wait_for_visible(*Navbar.PROFILE_TOGGLE_BTN, timeout=10)
    logger.info(f"Admin successfully authenticated. Current URL: {driver.current_url}")
    return driver


def pytest_runtest_logstart(nodeid, location):
    print(f"\n[RUNNING TEST] {nodeid}")


def pytest_runtest_logreport(report):
    if report.when == "call":
        if report.passed:
            print(f"[PASSED] {report.nodeid} ({report.duration:.2f}s)")
        elif report.failed:
            print(f"[FAILED] {report.nodeid} ({report.duration:.2f}s)")
        elif report.skipped:
            print(f"[SKIPPED] {report.nodeid}")
    elif report.when == "setup" and report.failed:
        print(f"[SETUP ERROR] {report.nodeid}")


