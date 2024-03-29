import { default as NextLink } from 'next/link';
import styled from 'styled-components';

import { useAuth } from '../../../lib/Auth';

const List = styled.ul`
  margin-bottom: calc(var(--margin) * 3);
  list-style: none;

  li {
    margin-bottom: 0.55rem;
  }
`;

export default function Navigation({ closeNavigation }) {
    const auth = useAuth();

    const Link = ({ href, children }) => (
        <NextLink href={href} passHref>
            <a onClick={closeNavigation}>{ children }</a>
        </NextLink>
    );

    // Render an empty navigation when we're still determining if we're logged in or not
    if (auth.user === null) {
        return null;
    }

    // Guests should only see the /login entry
    if (auth.user === false) {
        return (
            <List>
                <li><Link href="/login">/login</Link></li>
            </List>
        );
    }

    return (
        <>
            <List>
                <li><Link href="/logout">/logout</Link></li>
            </List>
            <List>
                <li><Link href="/leave">/Leave tool</Link></li>
                <li><Link href="/stateEvent">/Add State Event</Link></li>
                <li><Link href="/createStructure">/Create Structure</Link></li>
            </List>
        </>
    );
}
