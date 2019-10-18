// @flow
import OptionsSync from 'webext-options-sync'

export default async function init() {
    const optionsStorage = new OptionsSync()
    const options = await optionsStorage.getAll()
    const localStorageKey = `diff-view_options_user_${
        options.bitbucketUsername
    }`
    const existingOptions = JSON.parse(
        localStorage.getItem(localStorageKey) || '{}'
    )
    localStorage.setItem(
        localStorageKey,
        JSON.stringify({
            timestamp: +new Date(),
            data: {
                ignoreWhitespace: true,
                showWhitespaceCharacters: true,
                hideComments: existingOptions.hideComments || false,
                hideEdiff: existingOptions.hideEdiff || false,
                diffType: existingOptions.diffType || 'unified',
            },
        })
    )
}
