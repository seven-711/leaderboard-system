import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LogOut, Menu, X } from 'lucide-react';

export interface StaggeredMenuItem {
    label: string;
    link: string;
    icon?: React.ElementType;
}

export interface StaggeredMenuProps {
    items: StaggeredMenuItem[];
    logoUrl?: string; // Optional, might use text instead
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
    items = [],

}) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);
    const location = useLocation();

    const panelRef = useRef<HTMLDivElement | null>(null);
    const preLayersRef = useRef<HTMLDivElement | null>(null);
    const preLayerElsRef = useRef<HTMLElement[]>([]);

    const openTlRef = useRef<gsap.core.Timeline | null>(null);
    const closeTweenRef = useRef<gsap.core.Tween | null>(null);

    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
    const busyRef = useRef(false);

    // Configuration
    const accentColor = '#39ff14'; // Neon Green
    const colors = ['#1a1a1a', '#0a0a0a']; // Dark theme colors

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;

            if (!panel) return;

            let preLayers: HTMLElement[] = [];
            if (preContainer) {
                preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
            }
            preLayerElsRef.current = preLayers;

            const offscreen = 100;
            gsap.set([panel, ...preLayers], { xPercent: offscreen });

            // Dynamic Island Animation Setup
            if (toggleBtnRef.current) {
                gsap.set(toggleBtnRef.current, { width: 'auto' });
            }
        });
        return () => ctx.revert();
    }, []);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
        const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const tl = gsap.timeline({ paused: true });

        layerStates.forEach((ls, i) => {
            tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        const panelDuration = 0.65;

        tl.fromTo(
            panel,
            { xPercent: panelStart },
            { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
            panelInsertTime
        );

        if (itemEls.length) {
            const itemsStartRatio = 0.15;
            const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

            tl.to(
                itemEls,
                { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
                itemsStart
            );
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => {
                busyRef.current = false;
            });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        const all: HTMLElement[] = [...layers, panel];
        closeTweenRef.current?.kill();

        const offscreen = 100;

        closeTweenRef.current = gsap.to(all, {
            xPercent: offscreen,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
                busyRef.current = false;
            }
        });
    }, []);

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);

        if (target) {
            playOpen();
        } else {
            playClose();
        }

        // Dynamic Island Animation
        if (toggleBtnRef.current) {
            if (target) {
                gsap.to(toggleBtnRef.current, {
                    width: 56, // circle size
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            } else {
                gsap.to(toggleBtnRef.current, {
                    width: 80, // pill size
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            }
        }

    }, [playOpen, playClose]);

    const closeMenu = useCallback(() => {
        if (openRef.current) {
            openRef.current = false;
            setOpen(false);
            playClose();

            if (toggleBtnRef.current) {
                gsap.to(toggleBtnRef.current, {
                    width: 80, // pill size
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            }
        }
    }, [playClose]);

    // Close when clicking a link
    const handleLinkClick = () => {
        closeMenu();
    };

    return (
        <div className={`sm-scope fixed top-0 left-0 w-full h-0 z-[100]`}>
            <div className={`staggered-menu-wrapper pointer-events-none relative w-full h-screen`}
                style={{ ['--sm-accent' as any]: accentColor } as React.CSSProperties}
            >
                <div ref={preLayersRef} className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]">
                    {colors.map((c, i) => (
                        <div
                            key={i}
                            className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                            style={{ background: c }}
                        />
                    ))}
                </div>



                <div className="absolute top-4 right-6 z-[101] pointer-events-auto">
                    <button
                        ref={toggleBtnRef}
                        onClick={toggleMenu}
                        className={cn(
                            "h-10 backdrop-blur-sm bg-black/10 rounded-full flex items-center justify-center shadow-lg border border-white/10 overflow-hidden",
                            "transition-shadow hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] w-[80px]"
                        )}
                    >
                        <div className="flex items-center justify-center w-full h-full relative">
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center transition-all duration-300 p-2",
                                open ? "opacity-0 rotate-180 scale-50" : "opacity-100 rotate-0 scale-100"
                            )}>
                                <Menu className="w-5 h-5 text-white" />
                            </div>
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center transition-all duration-300 p-2",
                                open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-50"
                            )}>
                                <X className="w-5 h-5 text-[var(--color-neon-green)]" />
                            </div>
                        </div>
                    </button>
                </div>

                <aside
                    ref={panelRef}
                    className="staggered-menu-panel absolute top-0 right-0 h-full bg-[var(--color-dark-base)] flex flex-col p-[6em_2em_2em_2em] overflow-y-auto z-10 pointer-events-auto border-l border-white/10"
                >
                    <div className="flex-1 flex flex-col gap-5">
                        <ul className="list-none m-0 p-0 flex flex-col gap-4">
                            {items.map((it, idx) => {
                                const isActive = location.pathname === it.link || (it.link !== "/admin" && location.pathname.startsWith(it.link));
                                return (
                                    <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                                        <Link
                                            to={it.link}
                                            onClick={handleLinkClick}
                                            className={cn(
                                                "sm-panel-item relative font-bold text-3xl sm:text-4xl cursor-pointer leading-none uppercase transition-colors duration-150 ease-linear inline-block no-underline pr-[1.4em]",
                                                isActive ? "text-[var(--color-neon-green)]" : "text-white hover:text-[var(--color-neon-green)]"
                                            )}
                                        >
                                            <span className="sm-panel-itemLabel inline-block flex items-center gap-3">
                                                {it.icon && React.createElement(it.icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
                                                {it.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-auto pt-8 border-t border-white/10">
                            <Link to="/" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-xl font-bold uppercase">
                                <LogOut className="w-6 h-6" />
                                Exit to App
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>

            <style>{`
        .sm-scope .staggered-menu-panel { width: 100%; max-width: 480px; }
        .sm-scope .sm-prelayers { width: 100%; max-width: 480px; }
      `}</style>
        </div>
    );
};
