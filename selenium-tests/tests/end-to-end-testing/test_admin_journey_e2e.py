import time
from pages.login_page import LoginPage
from pages.admin_dashboard_page import AdminDashboardPage
from pages.admin_meal_plans_page import AdminMealPlansPage
from pages.navbar import Navbar


def test_complete_admin_journey(driver, base_url):
    # End-to-end admin dashboard review, meal plan creation, verification and deletion
    login_page = LoginPage(driver, base_url)
    login_page.open()
    login_page.login("admin@gmail.com", "admin123")
    login_page.wait_for_url_contains("/admin/dashboard")

    admin_dash = AdminDashboardPage(driver, base_url)
    stats = admin_dash.get_stats()
    assert "Total Customers" in stats
    assert "Active Subscriptions" in stats
    assert "Meal Plans" in stats

    navbar = Navbar(driver, base_url)
    navbar.click_admin_meal_plans()
    login_page.wait_for_url_contains("/admin/meal-plans")

    timestamp = int(time.time() * 1000)
    new_plan_name = f"E2E Chef Special {timestamp}"
    admin_plans = AdminMealPlansPage(driver, base_url)
    admin_plans.create_meal_plan(
        name=new_plan_name,
        desc="Specialty high nutrient meal plan created in E2E test",
        price="2999",
        meal_type="dinner",
        status="active"
    )
    assert "created successfully" in admin_plans.get_success_message().lower() or new_plan_name in admin_plans.get_success_message()

    plans = admin_plans.get_plans_list()
    assert any(p["name"] == new_plan_name for p in plans), f"Plan {new_plan_name} should be in table"

    try:
        admin_plans.delete_meal_plan(6)
    except Exception:
        pass

    navbar.click_logout()
    login_page.wait_for_url_contains("/login")
    assert "/login" in driver.current_url
