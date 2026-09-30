from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from typing import List, Optional
import time


import logging

logger = logging.getLogger(__name__)


class BasePage:
    def __init__(self, driver: WebDriver, base_url: str):
        self.driver = driver
        self.base_url = base_url.rstrip("/")
        self.timeout = 10

    def open(self, path: str = "") -> None:
        url = f"{self.base_url}/{path.lstrip('/')}"
        logger.info(f"Opening URL: {url}")
        self.driver.get(url)

    def wait_for_element(self, by: By, selector: str, timeout: Optional[int] = None) -> WebElement:
        return WebDriverWait(self.driver, timeout or self.timeout).until(
            EC.presence_of_element_located((by, selector))
        )

    def wait_for_visible(self, by: By, selector: str, timeout: Optional[int] = None) -> WebElement:
        return WebDriverWait(self.driver, timeout or self.timeout).until(
            EC.visibility_of_element_located((by, selector))
        )

    def wait_for_clickable(self, by: By, selector: str, timeout: Optional[int] = None) -> WebElement:
        el = WebDriverWait(self.driver, timeout or self.timeout).until(
            EC.presence_of_element_located((by, selector))
        )
        try:
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
            time.sleep(0.3)
        except Exception:
            pass
        return WebDriverWait(self.driver, timeout or self.timeout).until(
            EC.element_to_be_clickable((by, selector))
        )

    def safe_click(self, by: By, selector: str, timeout: Optional[int] = None) -> None:
        el = self.wait_for_clickable(by, selector, timeout)
        try:
            el.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", el)

    def wait_for_elements(self, by: By, selector: str, timeout: Optional[int] = None) -> List[WebElement]:
        WebDriverWait(self.driver, timeout or self.timeout).until(
            EC.presence_of_element_located((by, selector))
        )
        return self.driver.find_elements(by, selector)

    def wait_for_url_contains(self, fragment: str, timeout: Optional[int] = None) -> bool:
        return WebDriverWait(self.driver, timeout or self.timeout).until(
            EC.url_contains(fragment)
        )

    def wait_for_url_not_contains(self, fragment: str, timeout: Optional[int] = None) -> bool:
        return WebDriverWait(self.driver, timeout or self.timeout).until(
            lambda d: fragment not in d.current_url
        )

    def get_current_url(self) -> str:
        return self.driver.current_url

    def get_title(self) -> str:
        return self.driver.title

