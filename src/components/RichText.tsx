import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { apiClient } from '~/utils/apiClient'
import { Text, Container, Flex, Input } from '@mantine/core'
import { useEffect, useState } from 'react'
import { KeyedMutator } from 'swr'
import { Memo } from '$prisma/client'

type TextEditorProps = {
  title: string
  content: string
  currentMemoId: string
  eventHandler: KeyedMutator<Memo[]>
}

type updatedTime = {
  title: Date
  content: Date
}

const postMemo = async (
  content: string,
  currentMemoId: string,
  titleorContent: 'title' | 'content',
  fetchData?: KeyedMutator<Memo[]>,
  lastUpdated?: updatedTime
) => {
  const now = new Date()
  const bodyContent =
    titleorContent === 'title' ? { title: content } : { content: content }
  const lastUpdatedTime =
    titleorContent === 'title' ? lastUpdated?.title : lastUpdated?.content

  if (!lastUpdatedTime || now.getTime() - lastUpdatedTime.getTime() > 2000) {
    await apiClient.memos
      ._memoId(currentMemoId)
      .put({
        body: bodyContent
      })
      .then((res) => {
        if (res.status === 204) {
          if (lastUpdated) {
            if (titleorContent === 'title') {
              lastUpdated.title = now
            } else {
              lastUpdated.content = now
            }
          }
          if (fetchData) fetchData()
        } else
          return Promise.reject(
            new Error('failed to update memo title or content')
          )
      })
  }
}

function Demo({
  title,
  content,
  currentMemoId,
  eventHandler
}: TextEditorProps) {
  const [memoTitle, setTitle] = useState<string>(title)
  //文字がたくさん入力された時に、リクエストをしすぎないようにする
  const lastUpdated: updatedTime = {
    title: new Date(),
    content: new Date()
  }
  const editor = useEditor({
    onBeforeCreate({ editor }) {
      editor.on('update', async () => {
        await postMemo(
          editor.getHTML(),
          currentMemoId,
          'content',
          undefined,
          lastUpdated
        )
      })
    },
    //フォーカスが外れたときにリクエストを送る
    onBlur({ editor }) {
      postMemo(editor.getHTML(), currentMemoId, 'content', eventHandler)
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
    postMemo(
      e.target.value,
      currentMemoId,
      'title',
      undefined,
      lastUpdated
    ).catch((error) => {
      console.log(error)
    })
  }

  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    postMemo(e.target.value, currentMemoId, 'title', eventHandler).catch(
      (error) => {
        console.log(error)
      }
    )
  }

  useEffect(() => {
    editor?.commands.setContent(content)
    console.log(editor?.getText())
    setTitle(title)
  }, [content, title])

  return (
    <Container>
      <Flex>
        <Text>タイトル{title.length}/100</Text>
        <Text>本文{editor?.getText().length}/10000</Text>
      </Flex>
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
    </Container>
  )
}

export default Demo
