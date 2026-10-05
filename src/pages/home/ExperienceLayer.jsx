/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { Box, RBox, Torx, border, type, u } from './canvas'

/**
 * Experience — Figma group "Experience", 1259.5 x 595.05.
 * Contains the panel ("experience", 848.53 x 555 at 0,0) and the three link
 * cards down the right. All coordinates are group-relative.
 */

/* Rectangle 39359 x3 — card y from the export; titles keep their own box. */
const CARDS = [
  { title: 'Education', y: 13.98, to: '/achievements', title_x: 20.78, title_w: 110.08, title_y: 15.65 },
  { title: 'Achievements', y: 217.67, to: '/achievements', title_x: 20.03, title_w: 152.02, title_y: 16.3 },
  { title: 'Community', y: 421.35, to: '/achievements', title_x: 19.78, title_w: 112.1, title_y: 15.65 },
]

const CARD_X = 929.51
const CARD_W = 329.99
const CARD_H = 173.7

/**
 * Card outline — rounded rect with a chamfered bottom-left corner, inset by
 * half the 8.68 stroke so the border stays inside the 329.99 x 173.7 box.
 */
function CardOutline() {
  return (
    <svg
      fill="none"
      height="100%"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0 }}
      viewBox="0 0 330 173.7"
      width="100%"
    >
      <path
        className="hm-linkcard-outline"
        d="M30 4.34H299.66A26 26 0 0 1 325.66 30.34V143.36A26 26 0 0 1 299.66 169.36H72L4.34 108V30.34A26 26 0 0 1 30 4.34Z"
        stroke="#2A2A2A"
        strokeLinejoin="round"
        strokeWidth="8.68"
      />
    </svg>
  )
}

function LinkCard({ title, y, to, title_x, title_w, title_y }) {
  return (
    <Box as={Link} className="hm-linkcard" to={to} w={CARD_W} h={CARD_H} x={CARD_X} y={y}>
      <CardOutline />

      <Box
        className="hm-linkcard-title"
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 17.3684, lh: '160%' }),
          color: '#D6D6D6',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
        w={title_w}
        h={28.03}
        x={title_x}
        y={title_y}
      >
        {title}
      </Box>

      {/* Subtract + Ellipse 5907 + Ellipse 5909 — the hairline and its bead */}
      <Box style={{ background: '#7E7E7E' }} w={107.56} h={5.3} x={23.05} y={39.04} />
      <Box
        style={{
          borderTop: border(1, '#FFFFFF'),
          boxShadow: `0 ${u(3.21)} ${u(3.21)} rgba(0,0,0,.25)`,
        }}
        w={102.27}
        h={0}
        x={25.69}
        y={41.66}
      />
      <Box r="full" style={{ background: '#515051' }} w={4.03} h={3.99} x={23.68} y={39.69} />

      {/* Rectangle 39372 — angled capsule behind the arrow */}
      <RBox
        deg={35.68}
        r={26.0526}
        style={{
          background: '#1F1F1F',
          border: border(0.868, '#000000'),
          boxSizing: 'border-box',
        }}
        w={26.07}
        h={43.44}
        x={273.44}
        y={10.42}
      />
      <Box className="hm-linkcard-arrow" w={24} h={24} x={285} y={15.9}>
        <svg fill="none" height="100%" viewBox="0 0 24 24" width="100%">
          <path
            d="M6 18 18 6M9 6h9v9"
            stroke="#FFFFFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.74"
          />
        </svg>
      </Box>
    </Box>
  )
}

function ExperienceLayer() {
  return (
    <>
      {/* Rectangle 39357 — the black panel */}
      <Box
        r={30}
        style={{
          background: '#000000',
          border: border(10, '#2A2A2A'),
          boxSizing: 'border-box',
          boxShadow: `inset 0 ${u(4)} ${u(24)} rgba(0,0,0,.9)`,
        }}
        w={829}
        h={541.02}
        x={19.52}
        y={13.98}
      />

      {/* Rectangle 39369 — a 694.5 x 311 vector, not the plain rounded rect
          its bounding box suggests. The reference shows a header band whose
          bottom edge steps up TWICE on its way right, finishing flush with
          the panel's own 10px border — banner and border are both #2A2A2A,
          which is why they read as one continuous form — the band's right end
          converges to exactly the border's 13.98..23.98 band so there is no
          step where it hands over. The box is 311 tall
          because the same shape also carries the nub housing on the left
          edge, far below the band. Painted after the panel so it sits on it. */}
      <Box w={694.5} h={311} x={0} y={0}>
        <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 694.5 311" width="100%">
          <path
            d="M12 0H616L668 13.98H694.5V23.98H660L602 86H414L344 97H0V12A12 12 0 0 1 12 0Z"
            fill="#2A2A2A"
          />
          <rect fill="#2A2A2A" height="106" rx="20" width="40" x="0" y="198" />
        </svg>
      </Box>

      {/* Ellipse 5909 + Star 3 — banner screw. The new export moves Star 3
          from 581.51 to 553.80, which finally centres it in the head. */}
      <Box r="full" style={{ background: '#1F1F1F' }} w={35.01} h={35.05} x={549.52} y={23.98} />
      <Torx h={26.24} w={22.67} x={553.8} y={29.99} />

      {/* Rectangle 39374 — left-edge nub, with its Torx at the top and
          Ellipse 5910 as the bead at the bottom */}
      <Box
        r={30}
        style={{ background: '#1F1F1F', border: border(1, '#000000'), boxSizing: 'border-box' }}
        w={19.4}
        h={53.26}
        x={13.48}
        y={206.01}
      />
      <Torx h={12.02} w={11.97} x={17.51} y={209.99} />
      <Box r="full" style={{ background: '#515051' }} w={12.97} h={12.97} x={16.5} y={243.02} />

      {/* headings */}
      <Box
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 40, lh: 40 }),
          color: '#D6D6D6',
          display: 'flex',
          alignItems: 'center',
        }}
        w={289.06}
        h={39.99}
        x={83.5}
        y={31}
      >
        Experience
      </Box>
      <Box
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 20, lh: '160%' }),
          color: '#D6D6D6',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
        }}
        w={169.91}
        h={31.95}
        x={74.56}
        y={115.02}
      >
        Professional
      </Box>

      {CARDS.map((card) => (
        <LinkCard key={card.title} {...card} />
      ))}
    </>
  )
}

export default ExperienceLayer
