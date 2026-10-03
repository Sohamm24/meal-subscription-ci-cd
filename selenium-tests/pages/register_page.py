from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from pages.base_page import BasePage


class RegisterPage(BasePage):
    NAME_INPUT = (By.ID, "reg-name")
    EMAIL_INPUT = (By.ID, "reg-email")
    PASSWORD_INPUT = (By.ID, "reg-password")
    ROLE_SELECT = (By.ID, "reg-role")
    SUBMIT_BUTTON = (By.ID, "reg-submit")
    ERROR_ALERT = (By.CLASS_NAME, "alert-error")
    LOGIN_LINK = (By.XPATH, "//a[contains(text(), 'Sign in')]")

    def open(self) -> None:
        super().open("/register")

    def enter_name(self, name: str) -> None:
        el = self.wait_for_visible(*self.NAME_INPUT)
        el.clear()
        el.send_keys(name)

    def enter_email(self, email: str) -> None:
        el = self.wait_for_visible(*self.EMAIL_INPUT)
        el.clear()
        el.send_keys(email)

    def enter_password(self, password: str) -> None:
        el = self.wait_for_visible(*self.PASSWORD_INPUT)
        el.clear()
        el.send_keys(password)

    def select_role(self, role: str) -> None:
        try:
            select_els = self.driver.find_elements(*self.ROLE_SELECT)
            if len(select_els) > 0 and select_els[0].is_displayed():
                Select(select_els[0]).select_by_value(role)
        except Exception:
            pass

    def submit(self) -> None:
        self.safe_click(*self.SUBMIT_BUTTON)

    def complete_onboarding(self) -> None:
        try:
            # Step 2 -> Step 3
            step2_btn = self.wait_for_clickable(By.XPATH, "//button[contains(text(), 'Next: Sensitivities')]", timeout=3)
            step2_btn.click()
            # Step 3 -> Step 4
            step3_btn = self.wait_for_clickable(By.XPATH, "//button[contains(text(), 'Next: Cuisines')]", timeout=3)
            step3_btn.click()
            # Step 4 -> Finish
            complete_btn = self.wait_for_clickable(By.XPATH, "//button[contains(text(), 'Complete')]", timeout=3)
            complete_btn.click()
        except Exception:
            pass

    def register(self, name: str, email: str, password: str, role: str = "customer", finish_onboarding: bool = True) -> None:
        self.enter_name(name)
        self.enter_email(email)
        self.enter_password(password)
        self.select_role(role)
        self.submit()

        if finish_onboarding:
            # If an error alert is visible, do not try to advance onboarding
            try:
                errs = self.driver.find_elements(*self.ERROR_ALERT)
                if len(errs) > 0 and errs[0].is_displayed():
                    return
            except Exception:
                pass
            self.complete_onboarding()

    def get_error_message(self) -> str:
        el = self.wait_for_visible(*self.ERROR_ALERT)
        return (el.text or el.get_attribute("textContent") or "").strip()

    def click_login(self) -> None:
        self.safe_click(*self.LOGIN_LINK)
