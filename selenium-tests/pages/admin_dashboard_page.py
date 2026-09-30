from selenium.webdriver.common.by import By
from pages.base_page import BasePage
from typing import Dict, List


class AdminDashboardPage(BasePage):
    PAGE_TITLE = (By.CLASS_NAME, "page-title")
    STAT_CARDS = (By.CLASS_NAME, "stat-card")
    STAT_VALUES = (By.CLASS_NAME, "stat-value")
    STAT_LABELS = (By.CLASS_NAME, "stat-label")
    TABLE_ROWS = (By.CSS_SELECTOR, "table.table tbody tr")

    def open(self) -> None:
        super().open("/admin/dashboard")

    def get_stats(self) -> Dict[str, str]:
        cards = self.wait_for_elements(*self.STAT_CARDS)
        stats = {}
        for card in cards:
            val = card.find_element(*self.STAT_VALUES).text
            lbl = card.find_element(*self.STAT_LABELS).text
            stats[lbl] = val
        return stats

    def get_recent_subscriptions_count(self) -> int:
        try:
            rows = self.wait_for_elements(*self.TABLE_ROWS, timeout=4)
            return len(rows)
        except Exception:
            return 0
