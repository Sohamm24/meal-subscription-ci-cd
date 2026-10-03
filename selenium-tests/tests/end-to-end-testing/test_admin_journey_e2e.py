import time
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage
from pages.navbar import Navbar


def test_admin_route_redirection_and_portal_features(driver, base_url):
    # Admin login: admin pages removed in new frontend, should log in and redirect home
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("admin@gmail.com", "admin123")
    login_page.wait_for_url_not_contains("/login")

    navbar = Navbar(driver, base_url)
    assert navbar.is_logged_in()

    # Accessing removed admin routes should redirect to home route '/'
    driver.get(f"{base_url}/admin/dashboard")
    login_page.wait_for_url_not_contains("/admin/dashboard")
    assert "/admin/dashboard" not in driver.current_url

    driver.get(f"{base_url}/admin/meal-plans")
    login_page.wait_for_url_not_contains("/admin/meal-plans")
    assert "/admin/meal-plans" not in driver.current_url

    # Test profile customization modal in new frontend navbar
    navbar.click_change_profile()
    time.sleep(0.3)
    save_btn = navbar.wait_for_clickable(By.XPATH, "//button[contains(text(), 'Save Profile Changes')]")
    assert save_btn.is_displayed()
    save_btn.click()

    time.sleep(0.5)
    navbar.click_logout()
    login_page.wait_for_url_contains("/login")
    assert "/login" in driver.current_url
