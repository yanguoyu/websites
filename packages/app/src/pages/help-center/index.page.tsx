import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import { DocSearch } from '@docsearch/react'
import '@docsearch/css'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import { Menu, getMenuWithPosts, getPostURL } from '../../utils'
import ImgNeuronLogo from './neuron-logo.png'
import ImgHelp from './help.png'
import IconMore from './more.svg'

const APPID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

interface PageProps {
  menuWithPosts: Menu[]
}

const HelpCenter: NextPage<PageProps> = ({ menuWithPosts }) => {
  const { t } = useTranslation('help_center')

  return (
    <Page className={styles.page}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.neuron}>
            <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
            <span className={styles.name}>Neuron</span>
          </div>

          <div className={styles.text1}>{t('help_center')}</div>

          <div className={styles.search}>
            <DocSearch appId={APPID ?? ''} indexName="posts" apiKey={SEARCH_KEY ?? ''} />
          </div>
        </div>

        <div className={styles.right}>
          <Image src={ImgHelp} alt="Help" width={200} height={168} />
        </div>
      </div>

      <div className={styles.postMenus}>
        {menuWithPosts.map(menu => (
          <div key={menu.name} className={styles.postMenu}>
            <div className={styles.title}>
              <div className={styles.name}>{menu.name}</div>
              {menu.posts?.[0] && (
                <Link href={getPostURL(menu.posts[0])}>
                  <div className={styles.more}>
                    More <IconMore />
                  </div>
                </Link>
              )}
            </div>

            <div className={styles.posts}>
              {menu.posts?.map(post => (
                <Link key={post.number} className={styles.post} href={getPostURL(post)}>
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const menuWithPosts = await getMenuWithPosts()
  const lng = await serverSideTranslations(locale, ['common', 'help_center'])

  const props: PageProps = {
    menuWithPosts: menuWithPosts.map(menu => ({
      ...menu,
      posts: menu.posts?.slice(0, 4),
    })),
    ...lng,
  }

  return { props }
}

export default HelpCenter
