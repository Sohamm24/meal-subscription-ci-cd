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
        select_el = self.wait_for_visible(*self.ROLE_SELECT)
        select = Select(select_el)
        select.select_by_value(role)

    def submit(self) -> None:
        self.safe_click(*self.SUBMIT_BUTTON)

    def register(self, name: str, email: str, password: str, role: str = "customer") -> None:
        self.enter_name(name)
        self.enter_email(email)
        self.enter_password(password)
        self.select_role(role)
        self.submit()

    def get_error_message(self) -> str:
        el = self.wait_for_visible(*self.ERROR_ALERT)
        return (el.text or el.get_attribute("textContent") or "").strip()

    def click_login(self) -> None:
        self.safe_click(*self.LOGIN_LINK)
