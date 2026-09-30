import time
from pages.subscriptions_page import SubscriptionsPage
from pages.browse_plans_page import BrowsePlansPage


def test_customer_view_subscriptions(customer_logged_in, base_url):
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.open()
    browse_page.subscribe_to_plan(1)
    browse_page.get_success_message()
    time.sleep(0.5)

    subs_page = SubscriptionsPage(customer_logged_in, base_url)
    subs_page.open()
    subs = subs_page.get_subscriptions()
    assert len(subs) > 0


def test_customer_pause_and_resume_subscription(customer_logged_in, base_url):
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.open()
    browse_page.subscribe_to_plan(2)
    browse_page.get_success_message()
    time.sleep(0.5)

    subs_page = SubscriptionsPage(customer_logged_in, base_url)
    subs_page.open()
    time.sleep(0.5)
    subs_page.pause_subscription()
    msg = subs_page.get_success_message()
    assert "paused" in msg.lower()

    time.sleep(0.5)
    subs_page.resume_subscription()
    resume_msg = subs_page.get_success_message()
    assert "active" in resume_msg.lower()


def test_customer_cancel_subscription(customer_logged_in, base_url):
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.open()
    browse_page.subscribe_to_plan(3)
    browse_page.get_success_message()
    time.sleep(0.5)

    subs_page = SubscriptionsPage(customer_logged_in, base_url)
    subs_page.open()
    time.sleep(0.5)
    subs_page.cancel_subscription()
    msg = subs_page.get_success_message()
    assert "cancelled" in msg.lower()
