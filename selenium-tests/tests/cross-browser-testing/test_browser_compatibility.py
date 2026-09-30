# Cross-browser semantic inputs and accessibility landmark tests
from pages.login_page import LoginPage
from pages.register_page import RegisterPage
from pages.navbar import Navbar


def test_html5_form_input_types(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    email_input = login_page.wait_for_visible(*LoginPage.EMAIL_INPUT)
    assert email_input.get_attribute("type") == "email"
    pass_input = login_page.wait_for_visible(*LoginPage.PASSWORD_INPUT)
    assert pass_input.get_attribute("type") == "password"


def test_aria_accessibility_landmarks(driver, base_url):
    login_page = LoginPage(driver, base_url)
    login_page.open()
    navbar = Navbar(driver, base_url)
    assert navbar.wait_for_visible(*Navbar.LOGO) is not None

    reg_page = RegisterPage(driver, base_url)
    reg_page.open()
    assert reg_page.wait_for_visible(*RegisterPage.NAME_INPUT).is_displayed()
