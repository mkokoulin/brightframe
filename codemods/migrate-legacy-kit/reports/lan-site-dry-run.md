# migrate-legacy-kit — dry run

Target: `D:\dev\lan\lan-site\src\components`
Config: `codemods/migrate-legacy-kit/configs/lan-site.example.ts`

## manual-review (2)

- `D:/dev/lan/lan-site/src/components/Button/Button.stories.tsx`: Legacy `Button` navigates internally via `useRouter().push(to)`; `Btn` has no routing of its own. Replace with `<Btn onClick={() => router.push(to)}>` (or an `href`, if `to` is a plain URL) and drop the `to` prop.
- `D:/dev/lan/lan-site/src/components/Button/Button.test.tsx`: Legacy `Button` navigates internally via `useRouter().push(to)`; `Btn` has no routing of its own. Replace with `<Btn onClick={() => router.push(to)}>` (or an `href`, if `to` is a plain URL) and drop the `to` prop.

## global-css-import (9)

- `D:/dev/lan/lan-site/src/components/Button/Button.tsx`: Imports a plain global stylesheet ("./Button.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/Coffeeshop/Coffeeshop.tsx`: Imports a plain global stylesheet ("./Coffeeshop.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/CoworkingOptionsTable/CoworkingOptionsTable.tsx`: Imports a plain global stylesheet ("./CoworkingOptionsTable.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/Dialog/Dialog.tsx`: Imports a plain global stylesheet ("./Dialog.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/InfoBlock/InfoBlock.tsx`: Imports a plain global stylesheet ("./InfoBlock.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/Nav/Nav.tsx`: Imports a plain global stylesheet ("./Nav.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/PriceCard/PriceCard.tsx`: Imports a plain global stylesheet ("./PriceCard.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/PriceTable/PriceTable.tsx`: Imports a plain global stylesheet ("./PriceTable.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
- `D:/dev/lan/lan-site/src/components/SectionInfo/SectionInfo.tsx`: Imports a plain global stylesheet ("./SectionInfo.css") — CSS-Modules conversion isn't automated; convert it by hand, matching brightframe's own extraction (see the README's "Origin" section).
