import { MigrationWizardDataFragmentDoc } from '../generated/graphql-test'
import MigrationWizard from './MigrationWizard.vue'
import { defaultMessages } from '@cy/i18n'
import dedent from 'dedent'

describe('<MigrationWizard/>', { viewportWidth: 1280, viewportHeight: 1100 }, () => {
  it('renders Automatic rename', () => {
    cy.mountFragment(MigrationWizardDataFragmentDoc, {
      render () {
        return (<div class="p-16px">
          <MigrationWizard />
        </div>)
      },
    })

    cy.findByText(defaultMessages.migration.wizard.step1.button).should('be.visible')
  })

  it('renders Automatic rename with skip', () => {
    cy.mountFragment(MigrationWizardDataFragmentDoc, {
      render () {
        return (<div class="p-16px">
          <MigrationWizard />
        </div>)
      },
    })

    cy.findByText(defaultMessages.migration.renameAuto.changeButton).click()
    cy.findByText(defaultMessages.migration.renameAuto.modals.step1.buttonProceed).click()
    cy.findByText(defaultMessages.migration.renameAuto.modals.step2.option2).click()
    cy.findByText(defaultMessages.migration.renameAuto.modals.step2.buttonSave).click()
    cy.findByText(defaultMessages.migration.wizard.step1.buttonSkip).should('be.visible')
  })

  it('renders Manual rename', () => {
    cy.mountFragment(MigrationWizardDataFragmentDoc, {
      onResult (res) {
        res!.migration!.step = 'renameManual'
      },
      render () {
        return (<div class="p-16px">
          <MigrationWizard />
        </div>)
      },
    })

    cy.findByText(defaultMessages.migration.wizard.step2.button).should('be.visible')
  })

  it('renders Support file rename', () => {
    cy.mountFragment(MigrationWizardDataFragmentDoc, {
      onResult (res) {
        res!.migration!.step = 'renameSupport'
      },
      render () {
        return (<div class="p-16px">
          <MigrationWizard />
        </div>)
      },
    })

    cy.findByText(defaultMessages.migration.wizard.step3.button).should('be.visible')
  })

  it('renders Config File migration', () => {
    cy.mountFragment(MigrationWizardDataFragmentDoc, {
      onResult (res) {
        res.migration!.step = 'configFile'
        res.migration!.configBeforeCode = dedent`{
          "viewportWidth": 1280, 
          "viewportHeight": 1100
        }`

        res.migration!.configAfterCode = dedent`{
            viewportWidth: 1280, 
            viewportHeight: 1100
        }`
      },
      render () {
        return (<div class="p-16px">
          <MigrationWizard />
        </div>)
      },
    })

    cy.findByText(defaultMessages.migration.wizard.step4.button).should('be.visible')
  })

  it('renders component reconfigure section', () => {
    cy.mountFragment(MigrationWizardDataFragmentDoc, {
      onResult (res) {
        res.migration!.step = 'setupComponent'
      },
      render () {
        return (<div class="p-16px">
          <MigrationWizard />
        </div>)
      },
    })

    cy.findByText(defaultMessages.migration.wizard.step5.button).should('be.visible')
  })
})
