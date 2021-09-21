import { ReactNode } from "react";

// Component: DrawerContent.DescriptionItem - Child component of DrawerContent.
// Used for styling detail items in the drawer.
export const DescriptionItem = ({
  title,
  content,
}: {
  title: string;
  content: ReactNode;
}): JSX.Element => (
  <div className='site-description-item-profile-wrapper'>
    <p className='site-description-item-profile-p-label'>{title}:</p>
    {content}
  </div>
);
