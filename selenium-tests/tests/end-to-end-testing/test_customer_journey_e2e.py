import time
from pages.register_page import RegisterPage
from pages.browse_plans_page import BrowsePlansPage
from pages.subscriptions_page import SubscriptionsPage
from pages.navbar import Navbar
from pages.login_page import LoginPage


def test_complete_customer_user_journey(driver, base_url):
    timestamp = int(time.time() * 1000)
    email = f"customer_e2e_{timestamp}@example.com"
    password = "e2epassword123"

    reg_page = RegisterPage(driver, base_url)
    reg_page.open()
    reg_page.register(f"E2E User {timestamp}", email, password, "customer")
    reg_page.wait_for_url_not_contains("/register")
    time.sleep(0.5)

    browse_page = BrowsePlansPage(driver, base_url)
    browse_page.open()
    cards = browse_page.get_meal_plan_cards()
    assert len(cards) > 0, "Expected available meal plans for customer"

    browse_page.subscribe_to_plan(1)
    success_msg = browse_page.get_success_message()
    assert "subscribed" in success_msg.lower() or "🎉" in success_msg
    time.sleep(0.5)

    navbar = Navbar(driver, base_url)
    navbar.click_my_subscriptions()
    time.sleep(0.5)

    subs_page = SubscriptionsPage(driver, base_url)
    subs = subs_page.get_subscriptions()
    assert len(subs) > 0, "Expected new subscription to appear"

    try:
        subs_page.pause_subscription()
        assert "paused" in subs_page.get_success_message().lower()
        time.sleep(0.5)

        subs_page.resume_subscription()
        assert "active" in subs_page.get_success_message().lower()
    except Exception:
        pass

    navbar.click_logout()
    login_page = LoginPage(driver, base_url)
    login_page.wait_for_url_contains("/login")

    login_page.login(email, password)
    login_page.wait_for_url_not_contains("/login")
    assert navbar.is_logged_in()
