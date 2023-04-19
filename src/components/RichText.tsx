import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { apiClient } from '~/utils/apiClient'
import useAspidaSWR from '@aspida/swr'
import { useRecoilValue } from 'recoil'
import { Input } from '@mantine/core'
import { currentMemoIdState } from '~/store/recoil_state'
import { useEffect, useState } from 'react'

type TextEditorProps = {
  title: string
  content: string
}

const contentLastUpdated = new Date()
const titleLastUpdated = new Date()

const postMemo = async (
  content: string,
  currentMemoId: string,
  titleorContent: 'title' | 'content'
) => {
  const now = new Date()
  const bodyContent =
    titleorContent === 'title' ? { title: content } : { content: content }
  const lastUpdated =
    titleorContent === 'title' ? titleLastUpdated : contentLastUpdated
  if (now.getTime() - lastUpdated.getTime() > 1000) {
    titleLastUpdated.setTime(now.getTime())
    await apiClient.memos
      ._memoId(currentMemoId)
      .put({
        body: bodyContent
      })
      .then(() => {
        console.log('updated')
      })
  }
}

function Demo({ title, content }: TextEditorProps) {
  console.log(title)
  const currentMemoId = useRecoilValue<string>(currentMemoIdState)
  const [memoTitle, setTitle] = useState<string>(title)
  //文字がたくさん入力された時に、リクエストをしすぎないようにする
  const editor = useEditor({
    onBeforeCreate({ editor }) {
      editor.on('update', async () => {
        await postMemo(editor.getHTML(), currentMemoId, 'content')
      })
    },
    //フォーカスが外れたときにリクエストを送る
    onBlur({ editor }) {
      postMemo(editor.getHTML(), currentMemoId, 'content')
    },
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: content,
    autofocus: true
  })
  //タイトルが変更されたとき
  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    await postMemo(e.target.value, currentMemoId, 'title')
  }

  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    await postMemo(e.target.value, currentMemoId, 'title')
  }

  useEffect(() => {
    editor?.commands.setContent(content)
    setTitle(title)
  }, [content, title])

  return (
    <>
      <Input.Wrapper label={'title'}>
        <Input
          value={memoTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
        />
      </Input.Wrapper>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  )
}

export default Demo
