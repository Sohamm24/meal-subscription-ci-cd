# Functional tests for customer and admin authentication workflows
import time
from pages.login_page import LoginPage
from pages.register_page import RegisterPage
from pages.navbar import Navbar


def test_customer_login_success(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("customer@gmail.com", "customer123")
    login_page.wait_for_url_not_contains("/login")
    navbar = Navbar(driver, base_url)
    assert navbar.is_logged_in()


def test_admin_login_success(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("admin@gmail.com", "admin123")
    login_page.wait_for_url_not_contains("/login")
    navbar = Navbar(driver, base_url)
    assert navbar.is_logged_in()


def test_login_invalid_credentials(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("customer@gmail.com", "wrongpassword123")
    error_msg = login_page.get_error_message()
    assert "Invalid email or password" in error_msg or "failed" in error_msg.lower()


def test_customer_registration_success(driver, base_url):
    reg_page = RegisterPage(driver, base_url)
    reg_page.open()
    unique_email = f"user_{int(time.time() * 1000)}@example.com"
    reg_page.register("Functional Test User", unique_email, "securepass123", "customer")
    reg_page.wait_for_url_not_contains("/register")
    navbar = Navbar(driver, base_url)
    assert navbar.is_logged_in()


def test_admin_registration_success(driver, base_url):
    reg_page = RegisterPage(driver, base_url)
    reg_page.open()
    unique_email = f"admin_{int(time.time() * 1000)}@example.com"
    reg_page.register("New Admin User", unique_email, "securepass123", "admin")
    reg_page.wait_for_url_not_contains("/register")
    navbar = Navbar(driver, base_url)
    assert navbar.is_logged_in()


def test_logout_functionality(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("customer@gmail.com", "customer123")
    login_page.wait_for_url_not_contains("/login")
    navbar = Navbar(driver, base_url)
    assert navbar.is_logged_in()
    navbar.click_logout()
    login_page.wait_for_url_contains("/login")
    assert "/login" in driver.current_url
