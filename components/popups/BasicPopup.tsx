import { FC, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

const backgroundVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

type BasicPopupProps = {
    children: ReactNode;
    id?: string;
    handleClose: () => void | Promise<void>;
    isCloseDisabled: boolean;
};

export const BasicPopup: FC<BasicPopupProps> = ({
    children,
    id,
    handleClose,
    isCloseDisabled,
}) => {
    return (
        <motion.div
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            id={id}
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-row items-center justify-center bg-black/80"
        >
            <div className="relative w-fit bg-off-white py-20 px-32 text-center">
                <button
                    disabled={isCloseDisabled}
                    className="absolute top-3 right-5 text-2xl"
                    onClick={handleClose}
                >
                    &#10006;
                </button>
                {children}
            </div>
        </motion.div>
    );
};
