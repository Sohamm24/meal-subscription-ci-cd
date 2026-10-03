# Regression tests for route navigation edge cases and form boundaries
from pages.login_page import LoginPage
from pages.browse_plans_page import BrowsePlansPage


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
    login_page.wait_for_url_not_contains("/some-invalid-page-12345")
    assert "/some-invalid-page-12345" not in driver.current_url


def test_invalid_login_credentials_edge_case(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("nonexistent@domain.com", "wrongpass")
    error_msg = login_page.get_error_message()
    assert "Invalid email or password" in error_msg or "failed" in error_msg.lower()
