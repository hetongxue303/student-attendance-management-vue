import { App, ObjectDirective } from 'vue'

const directives = {}
export default {
  install(app: App) {
    Object.keys(directives).forEach((directive: string) => {
      app.directive(
        directive,
        (directives as { [key: string]: ObjectDirective })[directive]
      )
    })
  }
}
