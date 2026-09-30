# Functional tests for meal plans catalog and admin management
import time
from pages.browse_plans_page import BrowsePlansPage
from pages.admin_meal_plans_page import AdminMealPlansPage


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


def test_admin_create_meal_plan(admin_logged_in, base_url):
    admin_plans = AdminMealPlansPage(admin_logged_in, base_url)
    admin_plans.open()
    plan_name = f"Chef Special {int(time.time())}"
    admin_plans.create_meal_plan(
        name=plan_name,
        desc="Delicious multi-cuisine chef specially curated meal.",
        price="2200",
        meal_type="dinner",
        status="active"
    )
    success_msg = admin_plans.get_success_message()
    assert "created successfully" in success_msg.lower() or plan_name in success_msg


def test_admin_edit_meal_plan(admin_logged_in, base_url):
    admin_plans = AdminMealPlansPage(admin_logged_in, base_url)
    admin_plans.open()
    time.sleep(0.5)
    updated_name = f"Updated Keto {int(time.time())}"
    admin_plans.edit_meal_plan(
        plan_id=1,
        name=updated_name,
        desc="Updated keto meal description with extra avocado.",
        price="1699",
        meal_type="dinner",
        status="active"
    )
    success_msg = admin_plans.get_success_message()
    assert "updated" in success_msg.lower()
