import {useRef, useState, useEffect, CSSProperties} from 'react'

const Collapsible = ({
	children,
	innerComponent,
	isCollapsed,
	className,
	innerClassNameWrapper,
	hide,
	style
}: {
	children: React.ReactNode
	/** Component to be displayed when not collapsed */
	innerComponent: React.ReactNode
	/** Value that controls state for collapse logic */
	isCollapsed: boolean
	/** CSS to be applied on the wrapper component inside Collapsible */
	className?: string
	/** CSS to be applied on the inner component wrapper */
	innerClassNameWrapper?: string
	/** Triggers hide/show animation for the entire component */
	hide?: boolean
	style?: CSSProperties
}) => {
	const [childrenHeight, setChildrenHeight] = useState(0)
	const [innerHeight, setInnerHeight] = useState(0)

	const childrenRef = useRef<HTMLDivElement>(null)
	const innerComponentRef = useRef<HTMLDivElement>(null)

	const updateHeights = () => {
		setChildrenHeight(childrenRef.current?.offsetHeight ?? 0)
		setInnerHeight(innerComponentRef.current?.offsetHeight ?? 0)
	}

	useEffect(() => {
		updateHeights()
	}, [children, innerComponent])

	const getStyle = () => {
		if (hide) {
			return {height: 0, border: '0px'}
		}
		return {height: isCollapsed ? childrenHeight : childrenHeight + innerHeight}
	}

	return (
		<div className={className} style={{...style, ...getStyle(), transition: '.3s', overflow: 'hidden'}}>
			<div ref={childrenRef}>{children}</div>
			<div ref={innerComponentRef} className={`${innerClassNameWrapper ?? ''}`}>
				{innerComponent}
			</div>
		</div>
	)
}

export default Collapsible
