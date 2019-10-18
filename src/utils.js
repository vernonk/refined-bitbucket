// @flow
import OptionsSync from 'webext-options-sync'
import onetime from 'onetime'

export const getApiToken: () => string = onetime(
    async (): string => {
        const optionsStorage = new OptionsSync()
        const options = await optionsStorage.getAll()
        return options.personalAccessToken
    }
)

export const getMainBranch: () => string = onetime(
    (): string =>
        JSON.parse((document.body || {}).dataset.currentRepo).mainbranch.name
)

export function getFirstFileContents(
    localUrls: string[],
    externalUrl: string
): Promise<string | void> {
    const requests = localUrls.map(url =>
        fetch(url, { credentials: 'include' })
    )

    if (externalUrl) {
        requests.push(fetch(externalUrl))
    }

    return getFirstSuccessfulResponseText(requests)
}

export async function getFirstSuccessfulResponseText(
    requests: Promise<Response>[]
): Promise<string | void> {
    const responses: Array<
        | Response
        | {
              ok: false,
              error: any,
          }
    > = await Promise.all(
        requests.map(p => p.catch(error => ({ ok: false, error })))
    )
    const firstSuccessfulResponse = responses.find(response => response.ok)

    if (firstSuccessfulResponse && firstSuccessfulResponse.ok) {
        return firstSuccessfulResponse.text()
    }
}
