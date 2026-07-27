function Resumen_reserva() {
    return (
        <>

            <div className="pm-summary-card">

                <img className="pm-summary-image"
                    src="../../assets/pasarelas.jpg"
                    alt="Perito Moreno" />

                <h3>Resumen de tu reserva</h3>

                <div className="pm-summary-row">
                    <span>Servicio</span>
                    <strong>Perito Moreno Compartido</strong>
                </div>

                <div className="pm-summary-row">
                    <span>Salida</span>
                    <strong>08:00 hs</strong>
                </div>

                <div className="pm-summary-row">
                    <span>Regreso</span>
                    <strong>14:00 hs</strong>
                </div>

                <div className="pm-summary-row">
                    <span>Precio por persona</span>
                    <strong>ARS 35.000</strong>
                </div>

                <div className="pm-total">
                    ARS 70.000
                </div>

                <a className="pm-reserve-btn"
                    target='blank'
                    href="https://wa.me/5492966764900">
                    RESERVAR POR WHATSAPP
                </a>

                <small>
                    Tu reserva es 100% segura.
                </small>

            </div>
        </>

    )
}

export { Resumen_reserva };