'use client'

import { useState, FormEvent } from 'react'
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Container,
  Select,
  useToast,
} from '@chakra-ui/react'

export default function Home() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-3.5-turbo')
  const toast = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !apiKey) return

    setIsLoading(true)
    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, `You: ${userMessage}`])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: "You are a helpful AI assistant.",
          user_message: userMessage,
          model: model,
          api_key: apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let aiResponse = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        aiResponse += text
        setMessages(prev => {
          const newMessages = [...prev]
          if (newMessages[newMessages.length - 1]?.startsWith('AI:')) {
            newMessages[newMessages.length - 1] = `AI: ${aiResponse}`
          } else {
            newMessages.push(`AI: ${aiResponse}`)
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">AI Chat</Text>
        
        <Box>
          <Text mb={2}>OpenAI API Key:</Text>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenAI API key"
          />
        </Box>

        <Box>
          <Text mb={2}>Model:</Text>
          <Select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
          </Select>
        </Box>

        <Box
          borderWidth={1}
          borderRadius="md"
          p={4}
          height="400px"
          overflowY="auto"
        >
          {messages.map((message, index) => (
            <Text key={index} mb={2}>
              {message}
            </Text>
          ))}
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Sending..."
              width="full"
            >
              Send
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  )
} 