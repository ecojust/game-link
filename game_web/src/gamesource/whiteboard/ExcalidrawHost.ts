import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CaptureUpdateAction, Excalidraw, exportToBlob } from '@excalidraw/excalidraw'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import type { ExcalidrawImperativeAPI, ExcalidrawProps } from '@excalidraw/excalidraw/types'

export interface ExcalidrawMount {
  updateScene(elements: ExcalidrawElement[]): void
  getElements(): ExcalidrawElement[]
  exportPng(): Promise<Blob>
  unmount(): void
}

export function mountExcalidraw(
  host: HTMLElement,
  initialElements: ExcalidrawElement[],
  onChange: (elements: readonly ExcalidrawElement[]) => void,
  onReady: (api: ExcalidrawImperativeAPI) => void,
): ExcalidrawMount {
  const root: Root = createRoot(host)
  let api: ExcalidrawImperativeAPI | undefined
  const props: ExcalidrawProps = {
    initialData: { elements: initialElements },
    onChange: elements => onChange(elements),
    excalidrawAPI: instance => { api = instance; onReady(instance) },
    langCode: 'zh-CN',
    theme: 'light',
    isCollaborating: true,
    autoFocus: true,
    UIOptions: { tools: { image: false } },
  }
  root.render(createElement(Excalidraw, props))
  return {
    updateScene: elements => api?.updateScene({ elements, captureUpdate: CaptureUpdateAction.NEVER }),
    getElements: () => [...(api?.getSceneElementsIncludingDeleted() || [])],
    exportPng: async () => {
      if (!api) throw new Error('白板尚未准备好。')
      return exportToBlob({
        elements: api.getSceneElements(),
        appState: api.getAppState(),
        files: api.getFiles(),
        mimeType: 'image/png',
      })
    },
    unmount: () => root.unmount(),
  }
}
