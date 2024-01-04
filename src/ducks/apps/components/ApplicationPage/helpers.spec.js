import { handleIntent } from './helpers'

const mockIntentCreateServiceTerminate = jest.fn()
const mockIntentCreateService = jest
  .fn()
  .mockResolvedValue({ terminate: mockIntentCreateServiceTerminate })
const mockIntentRedirect = jest.fn()
jest.mock('cozy-interapp', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createService: mockIntentCreateService,
      redirect: mockIntentRedirect
    }
  })
})

describe('handleIntent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call only intents.redirect when we are outside of an Intent', async () => {
    const client = {}
    const intentData = undefined
    const app = {}

    await handleIntent(client, intentData, app)
    expect(mockIntentRedirect).toHaveBeenCalled()
    expect(mockIntentCreateService).not.toHaveBeenCalled()
  })
  it('should call only intents.createService AND intents.redirect when we are inside of an Intent', async () => {
    const client = {}
    const intentData = { data: { slug: 'konnectorSlug' } }
    const app = {}

    await handleIntent(client, intentData, app)
    expect(mockIntentCreateService).toHaveBeenCalled()
    expect(mockIntentRedirect).toHaveBeenCalled()
    expect(mockIntentCreateServiceTerminate).not.toHaveBeenCalled()
  })
  it('should call only intents.createService AND service.terminate when we are inside of an Intent and that we have terminateIfInstalled data option', async () => {
    const client = {}
    const intentData = { data: { terminateIfInstalled: true } }
    const app = {}

    await handleIntent(client, intentData, app)
    expect(mockIntentCreateService).toHaveBeenCalled()
    expect(mockIntentCreateServiceTerminate).toHaveBeenCalled()
    expect(mockIntentRedirect).not.toHaveBeenCalled()
  })
})
