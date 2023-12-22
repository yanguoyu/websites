import classnames from 'classnames'
import { ComponentProps, FC } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import styles from './index.module.scss'
import IconLogo from './logo.svg'
import IconMenu from './menu.svg'
import IconClose from './close.svg'
import { useIsMobile } from '../../hooks'
import { languages } from '../../utils'
import { Contacts } from '../Contacts'
import { LinkWithEffect } from '../UpsideDownEffect'

export type HeaderProps = ComponentProps<'div'>

export const Header: FC<HeaderProps> = props => {
  const isMobile = useIsMobile()
  return isMobile ? <Header$Mobile {...props} /> : <Header$Desktop {...props} />
}

export const Header$Desktop: FC<HeaderProps> = props => {
  const { t } = useTranslation('common')

  return (
    <div {...props} className={classnames(styles.header, props.className, styles.blur )}>
      <div className={classnames("container", styles.content)}>
        <div className={styles.left}>
          <Link href="/">
            <IconLogo />
          </Link>
        </div>

        <div className={styles.right}>
          <MenuDialog />
        </div>
      </div>
    </div>
  )
}

export const Header$Mobile: FC<HeaderProps> = props => {
  return (
    <div {...props} className={classnames("container", styles.headerMobile, props.className)}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Link href="/">
            <IconLogo width={32} height={32} />
          </Link>
        </div>

        <div className={styles.right}>
          <MenuDialog />
        </div>
      </div>
    </div>
  )
}

const MenuDialog: FC = () => {
  const { t } = useTranslation('common')
  const isMobile = useIsMobile()
  const router = useRouter()
  const { pathname, query } = router

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {/* This div wrapping layer is because SVGComponent cannot accept the ref from Dialog.Trigger, it will error. */}
        <div className={styles.menuDialogTrigger}>
          <IconMenu />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.menuDialogOverlay} />
        <Dialog.Content className={styles.menuDialogContent}>
          <div className={styles.top}>
            {isMobile && (
              <div className={styles.left}>
                <Link href="/">
                  <IconLogo width={32} height={32} />
                </Link>
              </div>
            )}

            <Dialog.Close asChild>
              <IconClose className={styles.close} />
            </Dialog.Close>
          </div>

          <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: 'never' } }}>
            <div className={styles.content}>
              <LinkWithEffect className={styles.title} href="/#branding">
                {t('Home')}
              </LinkWithEffect>

              <div className={styles.title}>{t('Services')}</div>
              <div className={styles.links}>
                <LinkWithEffect href="https://neuron.magickbase.com/">{t('Neuron Wallet')}</LinkWithEffect>
                <span title="Coming soon">{t('CKB Explorer')}</span>
                <span title="Coming soon">{t('Godwoke Explorer')}</span>
                <span title="Coming soon">{t('Axon Explorer')}</span>
                <span title="Coming soon">{t('Kuai')}</span>
              </div>

              <LinkWithEffect
                className={styles.title}
                href="https://github.com/nervosnetwork/ckb/wiki/Public-JSON-RPC-nodes"
              >
                {t('Public Node')}
              </LinkWithEffect>

              <div className={styles.title}>{t('Language')}</div>
              <div className={classnames(styles.links, styles.languages)}>
                {languages.map(language => (
                  <LinkWithEffect
                    key={language.name}
                    className={classnames(styles.languageItem, {
                      [styles.selected ?? '']: language.localeName === router.locale,
                    })}
                    href={{ pathname, query }}
                    locale={language.localeName}
                  >
                    {language.name}
                  </LinkWithEffect>
                ))}
              </div>
            </div>
          </OverlayScrollbarsComponent>

          <Contacts className={styles.contacts} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
