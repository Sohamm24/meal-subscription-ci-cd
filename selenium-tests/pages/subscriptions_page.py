from selenium.webdriver.common.by import By
from pages.base_page import BasePage
from typing import List, Dict, Optional


class SubscriptionsPage(BasePage):
    PAGE_TITLE = (By.CLASS_NAME, "page-title")
    SUB_CARDS = (By.CLASS_NAME, "sub-card")
    SUB_NAME = (By.CLASS_NAME, "sub-name")
    SUB_PRICE = (By.CLASS_NAME, "sub-price")
    BADGE = (By.CLASS_NAME, "badge")
    SUCCESS_ALERT = (By.CLASS_NAME, "alert-success")
    ERROR_ALERT = (By.CLASS_NAME, "alert-error")
    EMPTY_STATE = (By.CLASS_NAME, "empty-state")

    def open(self) -> None:
        super().open("/subscriptions")

    def get_subscriptions(self) -> List[Dict[str, str]]:
        try:
            cards = self.wait_for_elements(*self.SUB_CARDS, timeout=5)
        except Exception:
            return []
        results = []
        for card in cards:
            name_el = card.find_element(*self.SUB_NAME)
            badge_el = card.find_element(*self.BADGE)
            name = (name_el.text or name_el.get_attribute("textContent") or "").strip()
            badge = (badge_el.text or badge_el.get_attribute("textContent") or "").strip()
            results.append({"name": name, "status": badge})
        return results

    def pause_subscription(self, sub_id: Optional[int] = None) -> None:
        if sub_id is not None:
            self.safe_click(By.ID, f"pause-btn-{sub_id}")
            return
        self.safe_click(By.XPATH, "//button[contains(text(), 'Pause') or contains(@class, 'btn-warning')]")

    def resume_subscription(self, sub_id: Optional[int] = None) -> None:
        if sub_id is not None:
            self.safe_click(By.ID, f"resume-btn-{sub_id}")
            return
        self.safe_click(By.XPATH, "//button[contains(text(), 'Resume') or contains(@class, 'btn-success')]")

    def cancel_subscription(self, sub_id: Optional[int] = None) -> None:
        if sub_id is not None:
            for selector in [f"cancel-btn-{sub_id}", f"cancel-paused-btn-{sub_id}"]:
                try:
                    self.safe_click(By.ID, selector, timeout=3)
                    return
                except Exception:
                    pass
        self.safe_click(By.XPATH, "//button[contains(text(), 'Cancel') or contains(@class, 'btn-danger')]")

    def reactivate_subscription(self, sub_id: Optional[int] = None) -> None:
        if sub_id is not None:
            self.safe_click(By.ID, f"reactivate-btn-{sub_id}")
            return
        self.safe_click(By.XPATH, "//button[contains(text(), 'Reactivate')]")

    def get_success_message(self) -> str:
        el = self.wait_for_visible(*self.SUCCESS_ALERT)
        return (el.text or el.get_attribute("textContent") or "").strip()
