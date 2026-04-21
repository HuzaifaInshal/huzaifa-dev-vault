import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { Layout } from './doc-ui/Layout'
import { SectionIndex } from './doc-ui/SectionIndex'
import { mdxComponents } from './doc-ui/mdx-components'
import { buildRegistry, buildNavTree, collectSectionNodes } from './lib/registry'

const pages = buildRegistry()
const navTree = buildNavTree(pages)

// Directory nodes with no backing MDX page → get auto-generated listing routes
const sectionNodes = collectSectionNodes(navTree.nodes)

export default function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout pages={pages} />}>
            {/* Default redirect when no root index exists */}
            {!navTree.root && pages[0] && (
              <Route index element={<Navigate to={pages[0].path} replace />} />
            )}

            {/* MDX-backed pages */}
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

            {/* Auto-generated section listing pages */}
            {sectionNodes.map((node) => (
              <Route
                key={`section:${node.path}`}
                path={node.path.replace(/^\//, '')}
                element={<SectionIndex node={node} />}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </MDXProvider>
  )
}
