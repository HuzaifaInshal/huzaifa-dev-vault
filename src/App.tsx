import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { Layout } from './doc-ui/Layout'
import { mdxComponents } from './doc-ui/mdx-components'
import { buildRegistry } from './lib/registry'

const pages = buildRegistry()

// First page that isn't the root index itself — used for the default redirect
const firstNonRootPage = pages.find((p) => p.path !== '/')

export default function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout pages={pages} />}>
            {/* Redirect bare "/" to the first non-root page if no root index exists */}
            {!pages.some((p) => p.path === '/') && firstNonRootPage && (
              <Route
                index
                element={<Navigate to={firstNonRootPage.path} replace />}
              />
            )}

            {pages.map((page) => {
              const routePath = page.path.replace(/^\//, '') || undefined
              return (
                <Route
                  key={page.path}
                  path={routePath}
                  index={!routePath}
                  element={<page.Component />}
                />
              )
            })}
          </Route>
        </Routes>
      </BrowserRouter>
    </MDXProvider>
  )
}
