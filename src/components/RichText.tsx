import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { apiClient } from '~/utils/apiClient'
import {
  Text,
  Container,
  Flex,
  Input,
  Space,
  Notification
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { KeyedMutator } from 'swr'
import { Memo } from '$prisma/client'
import {
  IconAlertCircle,
  IconCheck,
  IconRefreshDot,
  IconX
} from '@tabler/icons-react'

type TextEditorProps = {
  title: string
  content: string
  currentMemoId: string
  eventHandler: KeyedMutator<Memo[]>
}

type PostMemoProps = {
  content: string
  currentMemoId: string
  titleorContent: 'title' | 'content'
  fetchData?: KeyedMutator<Memo[]>
}

type updatedTime = {
  title: Date
  content: Date
}

type postStatusProps = {
  isSaved: 'saved' | 'unsaved' | 'saving'
}

function PostStatus({ isSaved }: postStatusProps) {
  const IconProperty = {
    saved: {
      Icon: IconCheck,
      color: 'green',
      text: '保存済み'
    },
    unsaved: {
      Icon: IconAlertCircle,
      color: 'red',
      text: '未保存'
    },
    saving: {
      Icon: IconRefreshDot,
      color: 'yellow',
      text: '保存中'
    }
  }

  const { Icon, color, text } = IconProperty[isSaved]
  return (
    <Flex justify="flex-end" style={{ height: '100%' }}>
      <Text color={color}>
        <Icon size={20} />
        {text}
      </Text>
    </Flex>
  )
}

const postMemo = async ({
  content,
  currentMemoId,
  titleorContent,
  fetchData
}: PostMemoProps) => {
  const bodyContent =
    titleorContent === 'title' ? { title: content } : { content: content }
  await apiClient.memos
    ._memoId(currentMemoId)
    .put({
      body: bodyContent
    })
    .then((res) => {
      if (res.status === 204) {
        if (fetchData) fetchData()
      } else
        return Promise.reject(
          alert('メモの更新に失敗しました。もう一度お試しください。')
        )
    })
}

function Demo({
  title,
  content,
  currentMemoId,
  eventHandler
}: TextEditorProps) {
  const [isSaved, setIsSaved] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved'
  )
  const [memoTitle, setTitle] = useState<string>(title)
  //文字がたくさん入力された時に、リクエストをしすぎないようにする
  const lastUpdated: updatedTime = {
    title: new Date(),
    content: new Date()
  }

  const saveDataAndFetch = async (
    content: string,
    currentMemoId: string,
    titleorContent: 'title' | 'content',
    fetchData?: KeyedMutator<Memo[]>
  ) => {
    setIsSaved('saving')
    await postMemo({
      content,
      currentMemoId,
      titleorContent,
      fetchData
    })
      .then((res) => {
        console.log(res)
        setIsSaved('saved')
      })
      .catch((error) => {
        console.log(error)
        setIsSaved('unsaved')
      })
  }

  const editor = useEditor({
    onBeforeCreate({ editor }) {
      editor.on('update', async () => {
        if (Date.now() - lastUpdated.content.getTime() < 1000) return
        else {
          await saveDataAndFetch(
            editor.getHTML(),
            currentMemoId,
            'content',
            undefined
          ).then(() => {
            lastUpdated.content = new Date()
          })
        }
      })
    },
    //フォーカスが外れたときにリクエストを送る
    onBlur({ editor }) {
      if (editor.getText().length > 10000) {
        setIsSaved('unsaved')
        return
      }
      if (Date.now() - lastUpdated.content.getTime() > 1000) {
        saveDataAndFetch(
          editor.getHTML(),
          currentMemoId,
          'content',
          eventHandler
        )
      }
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
    if (e.target.value.length > 100) {
      setIsSaved('unsaved')
      return
    }
    if (Date.now() - lastUpdated.title.getTime() < 1000) return
    await saveDataAndFetch(
      e.target.value,
      currentMemoId,
      'title',
      undefined
    ).then(() => {
      lastUpdated.title = new Date()
    })
  }

  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length > 100) {
      setIsSaved('unsaved')
      return
    }
    if (Date.now() - lastUpdated.title.getTime() > 1000)
      await saveDataAndFetch(
        e.target.value,
        currentMemoId,
        'title',
        eventHandler
      ).then(() => {
        lastUpdated.title = new Date()
      })
  }

  useEffect(() => {
    editor?.commands.setContent(content)
    setTitle(title)
  }, [content, title])

  return (
    <Container>
      <PostStatus isSaved={isSaved} />
      <Space py={2} />
      <Flex justify={'flex-end'}>
        <Text mr={10}>タイトル文字数</Text>
        <Text color={memoTitle.length > 100 ? 'red' : 'black'}>
          {memoTitle.length}/100
        </Text>
      </Flex>
      <Input.Wrapper label={'title'}>
        <Input
          value={memoTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
        />
      </Input.Wrapper>
      <Space py={2} />
      <Flex justify={'flex-end'} m={10}>
        <Text mr={10}>メモ文字数</Text>
        {editor && (
          <Text color={editor?.getText().length > 10000 ? 'red' : 'black'}>
            {editor?.getText().length}/10000
          </Text>
        )}
      </Flex>
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
