import pytest
import time
from pages.login_page import LoginPage
from pages.browse_plans_page import BrowsePlansPage
from pages.navbar import Navbar

VIEWPORTS = [
    ("Desktop 1080p", 1920, 1080),
    ("Laptop HD", 1366, 768),
    ("Tablet Portrait", 768, 1024),
    ("Mobile iPhone", 375, 667),
]


@pytest.mark.parametrize("device_name,width,height", VIEWPORTS)
def test_login_page_responsive_layout(driver, base_url, device_name, width, height):
    driver.set_window_size(width, height)
    login_page = LoginPage(driver, base_url)
    login_page.open()
    email_input = login_page.wait_for_visible(*LoginPage.EMAIL_INPUT)
    assert email_input.is_displayed(), f"Email input not visible on {device_name}"
    submit_btn = login_page.wait_for_visible(*LoginPage.SUBMIT_BUTTON)
    assert submit_btn.is_displayed(), f"Submit button not visible on {device_name}"


@pytest.mark.parametrize("device_name,width,height", VIEWPORTS)
def test_browse_plans_responsive_grid(driver, base_url, device_name, width, height):
    driver.set_window_size(width, height)
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("customer@gmail.com", "customer123")
    login_page.wait_for_url_not_contains("/login")
    time.sleep(0.5)

    browse_page = BrowsePlansPage(driver, base_url)
    browse_page.open()
    time.sleep(0.5)
    cards = browse_page.get_meal_plan_cards()
    assert len(cards) > 0, f"No meal plans loaded on {device_name}"

    navbar = Navbar(driver, base_url)
    assert navbar.is_logged_in()
