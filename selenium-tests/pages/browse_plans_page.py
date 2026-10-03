from selenium.webdriver.common.by import By
from pages.base_page import BasePage
from typing import List, Dict


class BrowsePlansPage(BasePage):
    PAGE_TITLE = (By.CLASS_NAME, "page-title")
    MEAL_PLAN_CARDS = (By.CLASS_NAME, "meal-plan-card")
    MEAL_PLAN_NAME = (By.CLASS_NAME, "meal-plan-name")
    MEAL_PLAN_PRICE = (By.CLASS_NAME, "meal-plan-price")
    MEAL_PLAN_DESC = (By.CLASS_NAME, "meal-plan-desc")
    SUCCESS_ALERT = (By.CLASS_NAME, "alert-success")
    ERROR_ALERT = (By.CLASS_NAME, "alert-error")

    def open(self) -> None:
        super().open("/meals")

    def get_meal_plan_cards(self) -> List[Dict[str, str]]:
        cards = self.wait_for_elements(*self.MEAL_PLAN_CARDS)
        results = []
        for card in cards:
            name_el = card.find_element(*self.MEAL_PLAN_NAME)
            price_el = card.find_element(*self.MEAL_PLAN_PRICE)
            desc_el = card.find_element(*self.MEAL_PLAN_DESC)

            name = (name_el.text or name_el.get_attribute("textContent") or "").strip()
            price = (price_el.text or price_el.get_attribute("textContent") or "").strip()
            desc = (desc_el.text or desc_el.get_attribute("textContent") or "").strip()

            results.append({"name": name, "price": price, "description": desc})
        return results

    def subscribe_to_plan(self, plan_id: int) -> None:
        self.safe_click(By.ID, f"subscribe-btn-{plan_id}")

    def get_success_message(self) -> str:
        el = self.wait_for_visible(*self.SUCCESS_ALERT)
        return (el.text or el.get_attribute("textContent") or "").strip()

    def get_error_message(self) -> str:
        el = self.wait_for_visible(*self.ERROR_ALERT)
        return (el.text or el.get_attribute("textContent") or "").strip()
