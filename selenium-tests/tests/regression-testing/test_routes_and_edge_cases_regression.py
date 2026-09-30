# Regression tests for route navigation edge cases and form boundaries
from pages.login_page import LoginPage
from pages.browse_plans_page import BrowsePlansPage
from pages.admin_meal_plans_page import AdminMealPlansPage


def test_inactive_meal_plans_hidden_from_customers(customer_logged_in, base_url):
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.open()
    cards = browse_page.get_meal_plan_cards()
    for card in cards:
        assert "inactive" not in card["name"].lower()


def test_wildcard_route_redirection_for_customer(customer_logged_in, base_url):
    customer_logged_in.get(f"{base_url}/non-existent-random-route")
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.wait_for_url_not_contains("/non-existent-random-route")
    assert "/non-existent-random-route" not in customer_logged_in.current_url


def test_wildcard_route_redirection_for_unauthenticated(driver, base_url):
    driver.get(f"{base_url}/some-invalid-page-12345")
    login_page = LoginPage(driver, base_url)
    login_page.wait_for_url_contains("/login")
    assert "/login" in driver.current_url


def test_meal_plan_empty_fields_handling(admin_logged_in, base_url):
    admin_plans = AdminMealPlansPage(admin_logged_in, base_url)
    admin_plans.open()
    admin_plans.click_create_new()
    admin_plans.wait_for_clickable(*AdminMealPlansPage.SAVE_PLAN_BTN).click()
    assert admin_plans.wait_for_visible(*AdminMealPlansPage.MODAL_TITLE).is_displayed()
