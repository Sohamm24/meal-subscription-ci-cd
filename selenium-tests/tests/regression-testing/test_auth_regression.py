# Regression tests for authentication validations and role-based access guards
from pages.login_page import LoginPage
from pages.register_page import RegisterPage


def test_registration_short_password_validation(driver, base_url):
    reg_page = RegisterPage(driver, base_url)
    reg_page.open()
    reg_page.register("Short Pass User", "short@test.com", "12345", "customer")
    error_msg = reg_page.get_error_message()
    assert "at least 6 characters" in error_msg.lower()


def test_registration_duplicate_email_validation(driver, base_url):
    reg_page = RegisterPage(driver, base_url)
    reg_page.open()
    reg_page.register("Customer Duplicate", "customer@gmail.com", "secretpass123", "customer")
    error_msg = reg_page.get_error_message()
    assert "already exists" in error_msg.lower() or "failed" in error_msg.lower()


def test_unauthenticated_protected_route_redirection(driver, base_url):
    driver.get(f"{base_url}/admin/dashboard")
    login_page = LoginPage(driver, base_url)
    login_page.wait_for_url_contains("/login")
    assert "/login" in driver.current_url

    driver.get(f"{base_url}/subscriptions")
    login_page.wait_for_url_contains("/login")
    assert "/login" in driver.current_url


def test_customer_role_restricted_from_admin_pages(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("customer@gmail.com", "customer123")
    login_page.wait_for_url_not_contains("/login")

    driver.get(f"{base_url}/admin/dashboard")
    login_page.wait_for_url_not_contains("/admin/dashboard")
    assert "/admin/dashboard" not in driver.current_url


def test_empty_login_credentials_handling(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.submit()
    assert "/login" in driver.current_url
