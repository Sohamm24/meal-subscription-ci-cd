from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class LoginPage(BasePage):
    EMAIL_INPUT = (By.ID, "login-email")
    PASSWORD_INPUT = (By.ID, "login-password")
    SUBMIT_BUTTON = (By.ID, "login-submit")
    ERROR_ALERT = (By.CLASS_NAME, "alert-error")
    REGISTER_LINK = (By.XPATH, "//a[contains(text(), 'Create one free')]")

    def open(self) -> None:
        super().open("/login")

    def enter_email(self, email: str) -> None:
        el = self.wait_for_visible(*self.EMAIL_INPUT)
        el.clear()
        el.send_keys(email)

    def enter_password(self, password: str) -> None:
        el = self.wait_for_visible(*self.PASSWORD_INPUT)
        el.clear()
        el.send_keys(password)

    def submit(self) -> None:
        self.safe_click(*self.SUBMIT_BUTTON)

    def login(self, email: str, password: str) -> None:
        self.enter_email(email)
        self.enter_password(password)
        self.submit()

    def get_error_message(self) -> str:
        el = self.wait_for_visible(*self.ERROR_ALERT)
        return (el.text or el.get_attribute("textContent") or "").strip()

    def click_register(self) -> None:
        self.safe_click(*self.REGISTER_LINK)
