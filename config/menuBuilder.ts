import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { Link } from 'lucide-vue-next'

export class TinyurlMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }
    return menu
  }

  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    this.addMenuItem(menu, {
      id: 'tinyurl',
      title: 'Rövid URL-ek',
      path: '/admin/tinyurl',
      icon: Link,
      order: 90,
    })
    return menu
  }
}

export const tinyurlMenuBuilder = new TinyurlMenuBuilder()
