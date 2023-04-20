import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem
} from '@mantine/core'
import { IconCookie, IconArrowLeftRight, IconClock } from '@tabler/icons-react'

const mockdata = [
  {
    title: 'Safety first',
    description:
      'Since API type definition forces the controller type and http request, the test code is not necessary for communication.',
    icon: IconArrowLeftRight
  },
  {
    title: 'Privacy focused',
    description:
      'Setting up a full-stack development environment is simple, so the product can be completed quickly and safely.',
    icon: IconClock
  },
  {
    title: 'Japanese support',
    description:
      'The product is designed to be easy to use for Japanese users, so you can start using it right away.',
    icon: IconCookie
  }
]

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(24)
    }
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`
  },

  cardTitle: {
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm
    }
  }
}))

export function FeaturesCards() {
  const { classes, theme } = useStyles()
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ))

  return (
    <Container size="lg" py="xl">
      <Group position="center">
        <Badge variant="filled" size="lg">
          最強のフルスタックフレームワーク
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Frourio
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        From installation to deployment in one command All you need is
        TypeScript
      </Text>

      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[{ maxWidth: 'md', cols: 1 }]}
      >
        {features}
      </SimpleGrid>
    </Container>
  )
}

export default FeaturesCards
