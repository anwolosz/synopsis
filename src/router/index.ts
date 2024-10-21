import { createRouter, createWebHistory } from 'vue-router'
import SynopsisView from '@/views/SynopsisView.vue'
import IndexView from '@/views/IndexView.vue'
import SourcesView from '@/views/SourcesView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import Section from '@/components/Section.vue'
import { useSynopsisStore } from "@/stores/SynopsisStore"

const options: { [key: string]: string[] } = {
  "hu": ["KG", "SZIT", "KNB", "UF"],
  "en": ["ESV", "BT", "BJW", "SBLGNT", "NV"]
}

const languageDefaultRedirect = () =>
  Object.keys(options).map(language => ({
    path: `/${language}`,
    redirect: `/${language}/${options[language][0]}`
  }));

const translationDefaultRedirect = () =>
  Object.entries(options).flatMap(([language, versions]) =>
    versions.map(version => ({
      path: `/${version}`,
      redirect: `/${language}/${version}`
    }))
  );

const languageOptionsRegex = `(${Object.keys(options).join("|")})`;
const translationOptionsRegex = `(${Object.values(options).flat().join("|")})`;
function defaultLanguage() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (timeZone === "Europe/Budapest") {
    return "/hu/KG"
  }
  if (timeZone === "Europe/Warsaw Poland") {
    return "/en/BT"
  }
  return "/en/ESV"
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: defaultLanguage(),
    },
    ...languageDefaultRedirect(),
    ...translationDefaultRedirect(),
    {
      path: `/:language${languageOptionsRegex}/:translation${translationOptionsRegex}`,
      name: 'synopsis',
      component: SynopsisView
    },
    {
      path: `/:language${languageOptionsRegex}/about`,
      name: 'about',
      component: AboutView
    },
    {
      path: `/:language${languageOptionsRegex}/:translation${translationOptionsRegex}/index`,
      name: 'index',
      component: IndexView
    },
    {
      path: `/:language${languageOptionsRegex}/sources`,
      name: 'sources',
      component: SourcesView
    },
    {
      path: `/:language${languageOptionsRegex}/contact`,
      name: 'contact',
      component: ContactView
    },
    {
      path: `/:language${languageOptionsRegex}/:translation${translationOptionsRegex}/:id([1-9]|[1-9]\\d|[12]\\d{2}|3[0-5]\\d|36[0-7])`,
      name: 'section',
      component: Section,
      props: true
    }, {
      path: '/:param(.*)*',
      name: 'notFound',
      component: NotFoundView
    },
  ],
  scrollBehavior(to, from) {
    if (to.hash) {
      const el = window.location.href.split("#")[1];
      if (el.length) {
        const element = document.getElementById(el);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;

          const offset = 60;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
          return
        }
      }
    }

    if (to.name !== from.name) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  },
})

router.beforeEach((to) => {
  useSynopsisStore().setupLanguage(to.params.language)
  useSynopsisStore().setupTranslation(to.params.translation)
})
export default router
