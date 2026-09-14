terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.24"
    }
  }
}

resource "cloudflare_worker" "app" {
  account_id = var.cloudflare_account_id
  name       = "jenkins-selenium-demo"

  subdomain = {
    enabled          = true
    previews_enabled = false
  }
}