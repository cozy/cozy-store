In https://github.com/cozy/cozy-store/pull/428#issuecomment-432699812 @ptbrowne suggested to add a test to the fix contained in the pull request.

The main fix consisted in adding a missing prop to the `<AppInstallation>`component, see https://github.com/cozy/cozy-store/pull/428/commits/3a39835afaf4402e4af28d78d55a8e84c49d6ec0#diff-6ad4b055807eeaf735549a38808ab7baL89.

But we did not figure out how to test that this prop was actually passed correctly.

## Limitation of shallow rendering

The first test added in the current PR is just shallow rendering the `<InstallIntent />` component. So we cannot detect that it is actually passing a defined `appSlug` to `<AppInstallation />`.

## Mock and mount

The best compromise I found after a couple of hours of search an experiments is to mock the `<AppInstallation />` component and test if it is called with an actual `appSlug` props.

It works well in our case, but it is not future-proof. If tomorrow we add a new required prop to `<AppInstallation />` the current test is not able to detect if `<InstallAppIntent />` fails to pass a value for this new prop.

A test like this one could not have prevented the issue in https://github.com/cozy/cozy-store/pull/428, as it should have not be aware of the requirement of the `appSlug` prop, when developers did forget to report changes in `<InstallAppIntent />`.

Another point is that every component which has `<AppInstallation />` as child should embed a test like this one to ensure that `<AppInstallation />` is called correctly, and I did not find a way to easily mutualize the code in this test.

## Ideal solution

What I was looking for was something that could be writted like this:
```jsx
  const component = mount(<InstallAppIntent {...props} />)

  expected(Application.mock).toHaveBeenCalledWithRequiredProps()
```

It implies to access the `Application.propTypes`, which are mocked in the same time than the component, and are _de facto_ unusable.

Moreover, it is pretty painful to check `propTypes` in a unit test, the API does not provide any way to make fine validation (see the pretty poor [checkProptypes]( https://www.npmjs.com/package/prop-types#proptypescheckproptypes))

I am now convinced that it could be very useful to have an enhanced propTypes lib which can be tested in mocks.

Maybe I am wrong and I missed some point, if you know a better solution or an existing one I will be glad to know it too.

Thanks for your time !
