import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { css } from '@emotion/react';

export const ConnectedBTN = styled(Button)(({ }) => ({
    width: "90%",
    padding: '5px',
    paddingLeft: '10px',
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 2,
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
    textTransform: 'none',
}));

export const plannerStyles = css`
  .fc-timegrid-slot {
    height: 120px !important;
  }
  .fc-event {
    border: none !important;
    background: transparent !important;
  }
  .fc-daygrid-day-events {
    max-height: 8rem;
    overflow-y: auto;
  }
  .fc-direction-ltr .fc-timegrid-col-events {
    margin: 0px;
    width: 100%;
  }
  .fc .fc-daygrid-day.fc-day-today,
  .fc .fc-timegrid-col.fc-day-today {
    background-color: #efefef !important;
  }
  .fc-view-harness {
    background-color: #efefef !important;
  }
  .fc .fc-col-header-cell-cushion {
    background: aliceblue !important;
    width: 100%;
  }
  .fc .fc-timegrid-axis {
    background-color: #efefef;
  }
  .fc-dayGridMonth-view .fc-col-header-cell,
  .fc-timeGridDay-view .fc-col-header-cell {
    background-color: inherit;
    color: inherit;
  }
`;