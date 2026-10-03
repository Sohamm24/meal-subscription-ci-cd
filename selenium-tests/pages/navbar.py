from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class Navbar(BasePage):
    LOGO = (By.CLASS_NAME, "navbar-logo")
    PROFILE_TOGGLE_BTN = (By.CLASS_NAME, "profile-toggle-btn")
    USER_AVATAR = (By.CLASS_NAME, "user-avatar-circle")
    DROPDOWN_MENU = (By.CLASS_NAME, "profile-dropdown-menu")
    SIGN_IN_LINK = (By.XPATH, "//a[contains(text(), 'Sign In')]")
    GET_STARTED_BTN = (By.XPATH, "//a[contains(text(), 'Get Started')]")
    MY_SUBSCRIPTIONS_LINK = (By.XPATH, "//a[contains(text(), 'My Subscriptions')]")
    CHANGE_PROFILE_BTN = (By.XPATH, "//button[contains(., 'Change Profile')]")
    LOGOUT_BTN = (By.CLASS_NAME, "nav-link-logout")

    def ensure_dropdown_open(self) -> None:
        try:
            dropdowns = self.driver.find_elements(*self.DROPDOWN_MENU)
            if len(dropdowns) > 0 and dropdowns[0].is_displayed():
                return
        except Exception:
            pass
        self.safe_click(*self.PROFILE_TOGGLE_BTN)

    def click_logo(self) -> None:
        self.safe_click(*self.LOGO)

    def click_sign_in(self) -> None:
        self.ensure_dropdown_open()
        self.safe_click(*self.SIGN_IN_LINK)

    def click_get_started(self) -> None:
        self.ensure_dropdown_open()
        self.safe_click(*self.GET_STARTED_BTN)

    def click_browse_plans(self) -> None:
        self.open("/meals")

    def click_my_subscriptions(self) -> None:
        self.ensure_dropdown_open()
        self.safe_click(*self.MY_SUBSCRIPTIONS_LINK)

    def click_change_profile(self) -> None:
        self.ensure_dropdown_open()
        self.safe_click(*self.CHANGE_PROFILE_BTN)

    def click_admin_dashboard(self) -> None:
        self.open("/admin/dashboard")

    def click_admin_meal_plans(self) -> None:
        self.open("/admin/meal-plans")

    def click_logout(self) -> None:
        try:
            alert = self.driver.switch_to.alert
            alert.accept()
        except Exception:
            pass
        self.ensure_dropdown_open()
        self.safe_click(*self.LOGOUT_BTN)

    def is_logged_in(self) -> bool:
        try:
            avatars = self.driver.find_elements(*self.USER_AVATAR)
            if len(avatars) > 0 and avatars[0].is_displayed():
                return True
            self.ensure_dropdown_open()
            return self.wait_for_visible(*self.LOGOUT_BTN, timeout=3).is_displayed()
        except Exception:
            return False
