import { Modal } from "antd";

type TimeOverLapProps = {
    modalOpen: boolean;
    onClose: () => void
}

const TimeOverLap = ({ modalOpen, onClose }: TimeOverLapProps) => {
    return (
        <Modal
            open={modalOpen}
            footer={null}
            onCancel={onClose}
        >
            <p style={{ color: 'red', fontSize: 30, marginBottom: 20 }}>! Error</p>
            <h3>Event time overlaps with an existing event. Please choose a different time.</h3>
        </Modal>
    )
}

export default TimeOverLap