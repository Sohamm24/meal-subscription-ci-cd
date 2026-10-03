# Functional tests for meal plans catalog and filtering
import time
from selenium.webdriver.common.by import By
from pages.browse_plans_page import BrowsePlansPage


def test_customer_browse_meal_plans(customer_logged_in, base_url):
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.open()
    cards = browse_page.get_meal_plan_cards()
    assert len(cards) > 0
    first = cards[0]
    assert first["name"] != ""
    assert "₹" in first["price"] or "INR" in first["price"] or any(char.isdigit() for char in first["price"])


def test_customer_subscribe_to_meal_plan(customer_logged_in, base_url):
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.open()
    time.sleep(0.5)
    browse_page.subscribe_to_plan(1)
    success_msg = browse_page.get_success_message()
    assert "subscribed" in success_msg.lower() or "🎉" in success_msg


def test_meal_plans_category_filtering(customer_logged_in, base_url):
    browse_page = BrowsePlansPage(customer_logged_in, base_url)
    browse_page.open()
    time.sleep(0.5)

    # Click filter pill for 'lunch' or 'dinner'
    lunch_pill = browse_page.wait_for_clickable(By.XPATH, "//button[contains(text(), 'lunch') or contains(text(), 'Lunch')]")
    lunch_pill.click()
    time.sleep(0.3)

    cards = browse_page.get_meal_plan_cards()
    assert isinstance(cards, list)

    # Switch back to 'All Plans'
    all_pill = browse_page.wait_for_clickable(By.XPATH, "//button[contains(text(), 'All Plans')]")
    all_pill.click()
    time.sleep(0.3)
    assert len(browse_page.get_meal_plan_cards()) > 0
