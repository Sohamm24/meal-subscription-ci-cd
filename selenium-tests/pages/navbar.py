from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class Navbar(BasePage):
    LOGO = (By.CLASS_NAME, "navbar-logo")
    SIGN_IN_LINK = (By.XPATH, "//a[contains(text(), 'Sign In')]")
    GET_STARTED_BTN = (By.XPATH, "//a[contains(text(), 'Get Started')]")
    BROWSE_PLANS_LINK = (By.XPATH, "//a[contains(text(), 'Browse Plans')]")
    MY_SUBSCRIPTIONS_LINK = (By.XPATH, "//a[contains(text(), 'My Subscriptions')]")
    ADMIN_DASHBOARD_LINK = (By.XPATH, "//a[contains(text(), 'Dashboard')]")
    ADMIN_MEAL_PLANS_LINK = (By.XPATH, "//a[contains(text(), 'Meal Plans')]")
    LOGOUT_BTN = (By.CLASS_NAME, "nav-link-logout")

    def click_logo(self) -> None:
        self.safe_click(*self.LOGO)

    def click_sign_in(self) -> None:
        self.safe_click(*self.SIGN_IN_LINK)

    def click_get_started(self) -> None:
        self.safe_click(*self.GET_STARTED_BTN)

    def click_browse_plans(self) -> None:
        self.safe_click(*self.BROWSE_PLANS_LINK)

    def click_my_subscriptions(self) -> None:
        self.safe_click(*self.MY_SUBSCRIPTIONS_LINK)

    def click_admin_dashboard(self) -> None:
        self.safe_click(*self.ADMIN_DASHBOARD_LINK)

    def click_admin_meal_plans(self) -> None:
        self.safe_click(*self.ADMIN_MEAL_PLANS_LINK)

    def click_logout(self) -> None:
        try:
            alert = self.driver.switch_to.alert
            alert.accept()
        except Exception:
            pass
        self.safe_click(*self.LOGOUT_BTN)

    def is_logged_in(self) -> bool:
        try:
            self.wait_for_visible(*self.LOGOUT_BTN, timeout=3)
            return True
        except Exception:
            return False
